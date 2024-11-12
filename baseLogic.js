// const canvas = document.getElementById('canvas1');
// const ctx = canvas.getContext('2d');
// canvas.width=window.innerWidth;
// canvas.height=window.innerHeight;

class Card{
    constructor(type,name,attack,hp,energy){
        this.type=type;
        this.name=name;
        this.attack=attack;
        this.hp=hp;
        this.energy=energy;
    }
}

class Player{
    constructor(name,isAI=false,energy=0,hp=100){
        this.name=name;
        this.isAI=isAI;
        this.hp=hp;
        this.energy=energy;
        this.activeCard=null;
        this.cards=[];
    }

    printActiveCard(){
        if(!this.activeCard) return;
        console.log(`${this.name}'s active card:\n${this.activeCard.name}, ${this.activeCard.type}, ${this.activeCard.attack} dmg, ${this.activeCard.hp} hp, ${this.activeCard.energy} energy`);
    }

    drawCards(numOfCards) {
        this.cards = [];
        for (let i = 0; i < numOfCards; i++) {
            const randomIndex = Math.floor(Math.random() * availableCards.length);
            const card = availableCards[randomIndex];
            this.cards.push(card);
        }
        // Ensure at least one card can be played
        if (!this.cards.some(card => card.hp > 0 && card.energy <= this.energy)) {
            console.log(`${this.name} has drawn cards but none can be played!`);
        }
    }

    printDeck(){
        console.log(`${this.name}'s Deck:`);
        for(let i=0;i<3;i++){
            console.log(`${this.cards[i].name}, ${this.cards[i].type}, ${this.cards[i].attack} dmg, ${this.cards[i].hp} hp, ${this.cards[i].energy} energy`);
        }
    }
}

const availableCards = [
    new Card("electric","Pikachu",30,60,2),
    new Card("electric","Raichu",120,120,6),
    new Card("basic","Snorlax",80,150,4),
    new Card("basic","Eeve",20,50,1),
    new Card("fire","Charmender",30,60,2),
    new Card("fire","Charmeleon",60,100,5),
    new Card("fire","Magmar",60,70,3),
];

function setActiveCard(player,cardIndex,isAI){
    if(cardIndex==-1){
        console.log(`Passed without set card`);
        return;
    }
    if(player.cards[cardIndex] && player.energy>=player.cards[cardIndex].energy && player.cards[cardIndex].hp>0){
        player.activeCard= player.cards[cardIndex];
        player.energy -= player.cards[cardIndex].energy;
        console.log(`${player.name} set ${player.activeCard.name} as active`);

    }else{
        if(!isAI)console.log("Not Enough Energy or Invalid Card");
    }
}

function setActiveCardFromDeck(player,isAI){
    if (!player.activeCard && isAI) {
        for (let i = 0; i < player.cards.length; i++) {
            if (player.cards[i] && player.cards[i].hp > 0 && player.cards[i].energy <= player.energy) {
                setActiveCard(player, i,isAI);
                break;
            }
        }
    }
}

function showCardsInArray(cards){
    console.log(`Choose active card:`);
    cards.forEach((card, index) => {
        if (card) {
            console.log(`Enter ${index + 1} for ${card.name}\nenergy: ${card.energy}\nattack: ${card.attack}\nhp: ${card.hp}`);
        }
    });
    console.log(`Enter 0 to continue without setting active card `);
}

function newActiveCard(player){
    showCardsInArray(player.cards);
    const userChoice = parseInt(prompt("Choose card as index:"))-1;
    if (isNaN(userChoice) || userChoice < -1 || userChoice >= player.cards.length) {
        console.log("Invalid choice. Please select a valid card index.");
        return;
    }
    setActiveCard(player, userChoice);
}

function attackTo(attacker,defender,isAI){
    //console.log(`attack fun worked for ${attacker.name}`);
    if(attacker.activeCard && defender.activeCard){
        defender.activeCard.hp-=attacker.activeCard.attack;
        console.log(`${attacker.name}'s ${attacker.activeCard.name} delivered ${attacker.activeCard.attack} dmg to ${defender.name}'s ${defender.activeCard.name}
            ${defender.name}'s ${defender.activeCard.name} has ${defender.activeCard.hp} hp`);

        if(defender.activeCard.hp<=0){
            console.log(`${defender.name}'s ${defender.activeCard.name} is dead`)
            defender.activeCard=null;
    
            if (isAI) {
                setActiveCardFromDeck(defender, true);
            } else {
                newActiveCard(defender);
            }

            //defender.cards[activeCardIndex]=null;

        }
    }
    else if(attacker.activeCard && !defender.activeCard){
        defender.hp -= attacker.activeCard.attack;
        console.log(`${attacker.name}'s ${attacker.activeCard.name} delivered ${attacker.activeCard.attack} dmg to ${defender.name}
            ${defender.name} has ${defender.hp} hp`);

        if(defender.hp<=0){
            console.log(`${defender.name} is dead
                ${attacker.name} win`);
        }
    }
    else if(!attacker.activeCard && defender.activeCard){
        defender.activeCard.hp -= 20;
        console.log(`${attacker.name} delivered 20 dmg to ${defender.name}'s ${defender.activeCard.name}
            ${defender.name}'s ${defender.activeCard.name} has ${defender.activeCard.hp} hp`);

        if(defender.activeCard.hp<=0){
            console.log(`${defender.name}'s ${defender.activeCard.name} is dead`)
            defender.activeCard=null;
    
            if(isAI){setActiveCardFromDeck(defender,true);}
            else{newActiveCard(defender)};
        }
    }
    else{
        console.log("No active card");
        defender.hp-=20;
        console.log(`${attacker.name}' delivered 20 dmg to ${defender.name}
            ${defender.name}'s current hp ${defender.hp}`);
    }
}

function gameLoop(){
    
    let playerName = prompt("Enter player name:");
    console.log("Welcome ",playerName);

    const player1= new Player(playerName,false);
    const aiPlayer= new Player("AI Player",true);

    aiPlayer.drawCards(3);
    aiPlayer.printDeck();
    player1.drawCards(3);
    player1.printDeck();

    let player1Starts = true;
    let turn = 1;

    

    while(player1.cards.some(card => card.hp > 0) && aiPlayer.cards.some(card => card.hp > 0) && player1.hp>=0 && aiPlayer.hp>=0){
        console.log(`--- Turn ${turn} ---`);

        //if turn is 1 choose active cards for both
        if(!player1Starts){
            //ai logic
            console.log(`AI Player +1 energy`);
            aiPlayer.energy++;

            setActiveCardFromDeck(aiPlayer,true);

            if(aiPlayer.activeCard){
                attackTo(aiPlayer,player1,true);
            }

            player1Starts = !player1Starts;
        }
        else{ // Player does move

            player1.energy++;
            console.log(`${playerName} +1 energy`);
            console.log(`${playerName} currentEnergy: ${player1.energy}`);

            if(!player1.activeCard || player1.activeCard.hp<0){
                newActiveCard(player1);
            }
            

            player1.printActiveCard();
            console.log(`Enter 1 for Attack\n2 for Retreat\n3 for Pass Turn`);
            let actionChoice = parseInt(prompt("Choose action"));

            if (isNaN(actionChoice) || actionChoice < 1 || actionChoice > 3) {
                console.log("Invalid choice. Please select a valid action.");
                continue;
            }

            switch(actionChoice){
                case 1:
                    if(turn!=1){
                        attackTo(player1,aiPlayer,false);
                    }
                    else{
                        console.log("Should wait opponent to set its active card for 1 turn");
                    }
                    actionChoice=3
                    break;
                case 2:
                    //change card
                    if (player1.cards.some(card => card.hp > 0 && card.energy <= player1.energy)) {
                        newActiveCard(player1);
                    } else {
                        console.log("No valid cards to retreat to.");
                    }
                    actionChoice=3;
                        break;
                case 3:
                    //pass
                        break;
            } 
            
            if (actionChoice == 3) {  // If player doesn't pass turn, it switches
                player1Starts = !player1Starts;
            }
        }
        turn++;
    }

    if (aiPlayer.cards.every(card => card.hp <= 0)||aiPlayer.hp<=0) {
        console.log(`${playerName} wins!`);
    } else {
        console.log("AI Player wins!");
    }
}

gameLoop();

