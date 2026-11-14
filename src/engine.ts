import levelsData from './content/levels.json'
import sourcesData from './content/sources.json'

export type Resource = 'air' | 'power' | 'safety' | 'food' | 'water'
export type Amounts = Record<Resource, number>
export type Change = Partial<Amounts>
export type Delay = { afterTurns: number; changes: Change; reason: string }
export type Choice = { id: string; label: string; description: string; immediate: Change; delayed?: Delay[]; flags?: string[]; icon: string }
export type Level = { id: number; title: string; tag: string; summary: string; goal: string; terms: string[][]; start: Amounts; shifts: number; source: string; reflection: {question:string; answers:string[]; correct:number; explain:string}; choices: Choice[][] }
export type Source = {id:string; title:string; agency:string; record:string; eventAt:string; retrievedAt:string; url:string; fact:string; limits:string; location:string; units:string; licenseNote:string; reviewedAt:string}
export const levels = levelsData as Level[]
export const sources = sourcesData as Source[]
export type Pending = { due: number; changes: Change; reason: string }
export type Entry = { turn: number; title: string; detail: string; changes: Change; before: Amounts; after: Amounts; kind: 'choice'|'event' }
export type Game = { levelId:number; challenge:boolean; turn:number; values:Amounts; flags:string[]; pending:Pending[]; history:Entry[]; status:'playing'|'failed'|'complete'; failure?:string; checkpoint?:Game }
const keys:Resource[] = ['air','power','safety','food','water']
const clone = <T,>(value:T):T => JSON.parse(JSON.stringify(value)) as T
export const clamp = (n:number) => Math.max(0,Math.min(100,n))
export function changeValues(values:Amounts, changes:Change):Amounts {
  const next={...values}
  for(const key of keys) next[key]=clamp(values[key]+(changes[key]||0))
  return next
}
export function previewChanges(values:Amounts, changes:Change):Change {
  const after=changeValues(values,changes)
  return Object.fromEntries(keys.filter(key=>changes[key]!==undefined).map(key=>[key,after[key]-values[key]])) as Change
}
export function canAfford(game:Game, choice:Choice):string|undefined {
  for(const key of keys) if(game.values[key]+(choice.immediate[key]||0)<0) return key
}
export function newGame(levelId:number,challenge=false):Game {
  const level=levels.find(l=>l.id===levelId)!
  const values=clone(level.start)
  if(challenge){values.air-=10;values.power-=10;values.safety-=10;if(levelId===3){values.food-=5;values.water-=5}}
  return {levelId,challenge,turn:1,values,flags:[],pending:[],history:[],status:'playing'}
}
function addEntry(game:Game, title:string, detail:string, changes:Change, kind:Entry['kind']) {
  const before={...game.values}
  game.values=changeValues(game.values,changes)
  game.history.push({turn:game.turn,title,detail,changes,before,after:{...game.values},kind})
}
function checkFailure(game:Game):string|undefined {
  if(game.values.air<=0) return 'The air reserve reached zero. Try a different use of power.'
  if(game.values.safety<=0) return 'Crew safety reached zero. Try protection earlier.'
  if(game.values.power<=0) return 'The battery reached zero. Leave power for essential systems.'
  if(game.levelId===3 && game.values.water<=0) return 'The water reserve reached zero. Plan a smaller grow box or repair the recycler.'
}
export function choose(current:Game, choice:Choice):Game {
  const unaffordable=canAfford(current,choice)
  if(unaffordable) throw new Error(`Not enough ${unaffordable} for this choice.`)
  const game=clone(current)
  game.checkpoint=clone(current)
  addEntry(game,choice.label,choice.description,choice.immediate,'choice')
  for(const flag of choice.flags||[]) if(!game.flags.includes(flag)) game.flags.push(flag)
  for(const delay of choice.delayed||[]) game.pending.push({due:game.turn+delay.afterTurns,changes:delay.changes,reason:delay.reason})
  const level=levels.find(l=>l.id===game.levelId)!
  const wasFinalShift=game.turn===level.shifts
  let failure=checkFailure(game)
  if(!failure && game.turn<level.shifts) {
    game.turn++
    if(game.levelId===1 && game.turn>1) addEntry(game,'Routine air demand','The crew uses air during this shift.',{air:-15},'event')
    if(game.levelId===2 && game.turn===2) {
      const cost=game.flags.includes('shelter')?-5:game.flags.includes('shield')?-10:-15
      addEntry(game,'Practice storm scenario','Safety changes in this fictional exercise; the DONKI record is not a dose.',{safety:cost},'event')
    }
    if(game.levelId===3 && game.turn===2) addEntry(game,'Crew supplies used','The crew breathes and eats while crops grow.',{air:-10,food:-10},'event')
    if(game.levelId===3 && game.turn===4) addEntry(game,'Crew meal','The crew uses food before the final decision.',{food:-10},'event')
    const due=game.pending.filter(p=>p.due===game.turn)
    game.pending=game.pending.filter(p=>p.due!==game.turn)
    for(const event of due) addEntry(game,'Later consequence',event.reason,event.changes,'event')
    failure=checkFailure(game)
  }
  if(failure) {game.status='failed';game.failure=failure;return game}
  if(wasFinalShift) {
    const goal=game.levelId===3 ? game.values.food>=25 && game.values.water>0 : game.flags.includes('science')
    if(goal) game.status='complete'
    else {game.status='failed';game.failure=game.levelId===3?'The crew needs at least 25 food points. Try a better harvest plan.':'The mission needs one science scan. Try a science action.'}
  }
  return game
}
export function retry(game:Game):Game { return game.checkpoint ? {...clone(game.checkpoint),status:'playing'} : newGame(game.levelId,game.challenge) }
export function formatChange(changes:Change) {
  return Object.entries(changes).filter(([,v])=>v!==0).map(([key,value])=>`${key[0].toUpperCase()+key.slice(1)} ${value!>0?'+':''}${value}`).join(' · ') || 'No immediate point change'
}
