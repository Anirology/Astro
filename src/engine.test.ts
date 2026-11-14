import {describe,it,expect} from 'vitest'
import {levels,newGame,choose,retry,canAfford,previewChanges} from './engine'
const action=(level:number,turn:number,id:string)=>levels[level-1].choices[turn-1].find(c=>c.id===id)!
describe('mission engine',()=>{
  it('lets scan-first and recycler-first routes finish level 1',()=>{
    for(const route of [['scan','recycle','recycle'],['recycle','scan','recycle']]) {
      let game=newGame(1)
      route.forEach((id,i)=>game=choose(game,action(1,i+1,id)))
      expect(game.status).toBe('complete')
    }
  })
  it('records delayed air cost as missed recycler opportunity',()=>{
    const game=choose(newGame(1),action(1,1,'scan'))
    expect(game.values.air).toBe(45)
    expect(game.history.some(e=>e.detail.includes('could have run the air recycler'))).toBe(true)
  })
  it('finishes storm mission with safe indoor science',()=>{
    let game=newGame(2)
    ;['shelter','indoor','indoor'].forEach((id,i)=>game=choose(game,action(2,i+1,id)))
    expect(game.status).toBe('complete')
  })
  it('finishes garden with delayed harvest and message',()=>{
    let game=newGame(3)
    ;['greens','message','repair','recycle'].forEach((id,i)=>game=choose(game,action(3,i+1,id)))
    expect(game.status).toBe('complete')
    expect(game.history.some(e=>e.detail.includes("Earth's reply"))).toBe(true)
  })
  it('rejects unaffordable actions and rewinds failure',()=>{
    const game=newGame(1)
    game.values.power=5
    expect(canAfford(game,action(1,1,'scan'))).toBe('power')
    const attempt=choose(newGame(1),action(1,1,'scan'))
    expect(retry(attempt).turn).toBe(1)
  })
  it('lets a missed science goal be fixed by retrying the final shift',()=>{
    for(const [levelId,route,fix] of [
      [1,['recycle','recycle','recycle'],'scan'],
      [2,['shelter','restore','restore'],'indoor']
    ] as const){
      let game=newGame(levelId)
      route.forEach((id,i)=>game=choose(game,action(levelId,i+1,id)))
      expect(game.status).toBe('failed')
      game=choose(retry(game),action(levelId,3,fix))
      expect(game.status).toBe('complete')
    }
  })
  it('lets the garden recover with a costly emergency meal kit',()=>{
    let game=newGame(3)
    ;['conserve','local','repair','recycle'].forEach((id,i)=>game=choose(game,action(3,i+1,id)))
    expect(game.status).toBe('failed')
    game=choose(retry(game),action(3,4,'emergency'))
    expect(game.status).toBe('complete')
    expect(game.values.food).toBe(25)
  })
  it('keeps challenge replay deterministic and completable',()=>{
    let game=newGame(3,true)
    ;['greens','message','repair','recycle'].forEach((id,i)=>game=choose(game,action(3,i+1,id)))
    expect(game.challenge).toBe(true)
    expect(game.status).toBe('complete')
  })
  it('previews clamped values exactly',()=>{
    const game=newGame(1)
    game.values.air=95
    expect(previewChanges(game.values,action(1,1,'recycle').immediate).air).toBe(5)
  })
})
