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

    drawCards(numOfCards){
        this.cards=[];
        let passed=false;
        do{
            for(let i=0;i<numOfCards;i++){
                const randomIndex = Math.floor(Math.random() * availableCards.length);
                const card = availableCards[randomIndex];
                if (card.energy <= 1) {
                    passed = true; // Set passed to true if card's energy is <= 1
                    i=0;
                    this.cards.length=0;
                }
                this.cards.push(card);
                
                
            }
        }while(!passed)
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

function setActiveCard(player,cardIndex,isAI=false){
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
        return null;
    }
}

function setActiveCardFromDeck(player){
    if(!player.activeCard){
        for(let i=0;i<player.cards.length;i++){
            if (player.cards[i] !== null && setActiveCard(player, i, true)) {
                break;
            }
        }
    }
}

function showCardsInArray(cards){
    for(let i=0;i<cards.length;i++){
        if(cards[i]!=null){
            console.log(`Choose active card:
                Enter ${i+1} for ${cards[i].name} 
                energy: ${cards[i].energy} 
                attack: ${cards[i].attack} 
                hp: ${cards[i].hp}`);
        }
    }
    console.log(`Enter 0 to continue without setting active pokemon`);
}

function newActiveCard(player){
    showCardsInArray(player.cards);
    const userChoice = parseInt(prompt("Choose card as index:"))-1;
    setActiveCard(player, userChoice);
}

function attackTo(attacker,defender,isAI){

    if(attacker.activeCard && defender.activeCard){
        defender.activeCard.hp-=attacker.activeCard.attack;
        console.log(`${attacker.name}'s ${attacker.activeCard.name} delivered ${attacker.activeCard.attack} dmg to ${defender.name}'s ${defender.activeCard.name}`);

        if(defender.activeCard.hp<=0){
            console.log(`${defender.name}'s ${defender.activeCard.name} is dead`)
            defender.activeCard=null;
    
            if(isAI){setActiveCardFromDeck(defender);}
            else{newActiveCard(defender)};

            //defender.cards[activeCardIndex]=null;

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

    

    while(player1.cards.some(card => card.hp > 0) && aiPlayer.cards.some(card => card.hp > 0)){
        console.log(`--- Turn ${turn} ---`);

        //if turn is 1 choose active cards for both
        if(!player1Starts){
            //ai logic
            console.log(`AI Player +1 energy`);
            aiPlayer.energy++;

            setActiveCardFromDeck(aiPlayer);

            if(aiPlayer.activeCard){
                if(player1.activeCard){
                    attackTo(aiPlayer,player1,true);
                }else{
                    //pass
                }
            }

            player1Starts = !player1Starts;
        }
        else{ // Player does move

            player1.energy++;
            console.log(`${playerName} +1 energy`);
            console.log(`${playerName} currentEnergy: ${player1.energy}`);

            while(!player1.activeCard){
                newActiveCard(player1);
            }

            player1.printActiveCard();
            console.log(`Enter 1 for Attack\n2 for Retreat\n3 for Pass Turn`);
            let actionChoice = parseInt(prompt("Choose action"));

            switch(actionChoice){
                case 1:
                    if(turn!=1){
                        attackTo(player1,aiPlayer,false);
                    }
                    else{
                        console.log("Should wait opponent to set its active card for 1 turn");
                        actionChoice=3
                    }
                    break;
                case 2:
                    //change card
                    newActiveCard(player1);
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

    if (aiPlayer.cards.some(card => card.activeCard && card.activeCard.hp > 0)) {
        console.log("AI Player wins!");
    } else {
        console.log(`${playerName} wins!`);
    }
}

gameLoop();

