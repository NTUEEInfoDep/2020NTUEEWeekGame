const {isPromiseResolved} = require('promise-status-async');
const switchMode = (player) => {
    let snowMode = false;
    let fartMode = false;
    // Delete finished timer
    for (let i=0; i< player.sufferFrom; i++){
        if (isPromiseResolved(player.sufferFrom[i].timer)){
            player.sufferFrom.splice(i, 1);
        }
    }
    // Check snow/fart mode
    for (let i=0; i< player.sufferFrom; i++){
        if (player.sufferFrom[i].mode === 'snow'){
            snowMode = true;
        } else if (player.sufferFrom[i].mode === 'fart'){
            fartMode = true;
        }
    }
    
    if (snowMode){
        player.mode = 'snow';
        return
    } else if (fartMode){
        player.mode = 'fart';
        return 
    }

    player.mode = 'normal';
    return
}

function applyBigSkill(players, infos) {
    // Mode snow takes priority
    // Snow: apply burning on others
    // Fart: apply dizzy on others
    // All players have their respective promises
    // info may be null

    // Address respective timers
    for (let i=0; i< players.length; i++){
        // Every time renew the game frame, push the new timer into player's timers array
        let timers = [];
        for (let j=0; j< infos.length; j++){
            if (players[i].id != infos[j].parentId){
                if (infos[j] !== null && infos[j].hasAttribute('timer')){
                    timers.push({
                        mode: infos[j].mode,
                        // A promise, has invoked.
                        timer: infos[j].timer()
                    })
                };              
            }
        }
        players[i].sufferFrom = players[i].sufferFrom.concat(timers);
    }

    for (let i=0; i< players.length; i++){
        switchMode(players[i]);
    }
}

module.exports = applyBigSkill;