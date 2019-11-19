import { sum } from "../engine/foo";
import { StateManager, MainState } from "./battle/states";
import { posix } from "path";

export class GameScene extends Phaser.Scene {

    constructor() {
        super({
            key: "GameScene",
            active: false,
            visible: false
        })
    }

    private stateManager: StateManager; 
    private characters: DCharacter[] = [];
    private heros: DCharacter[] = [];
    private enemies: DCharacter[] = [];

    public create() {
        const result = sum(1, 2, 3);
        console.log(`The result is: ${result}`);

        this.heros.push(new DCharacter(this, "Hero1", 100, 400, false));
        this.heros.push(new DCharacter(this, "Hero2", 375, 400, false));
        this.heros.push(new DCharacter(this, "Hero3", 650, 400, false));

        this.enemies.push(new DCharacter(this, "Goblin1", 250, 100, true));
        this.enemies.push(new DCharacter(this, "Goblin2", 525, 100, true));

        this.characters = [...this.heros, ...this.enemies];

        this.stateManager =  new StateManager(this, this.characters);
        this.stateManager.nextState(new MainState(this.stateManager));

        // this.showMenuItems(["hello", "world", "to", "you"], (item: MenuItem) => {
        //     console.log(`Item = ${item.menuText} was clicked`);
        // })
    }


    public update() {
        //TODO
    }

    private menuItems: MenuItem[] = [];

    public showMenuItems(items: string[], handler: Function): void {
        const startY = 240;
        this.menuItems = items.map((element, idx) => 
            new MenuItem(this, 100, (idx * 30) + startY, element, handler)
        );
    }

    public destroyMenuItems() {
        this.menuItems.forEach(item => item.destroy());
        this.menuItems = [];
    }

    public registerEnemiesForClick(handler: Function) {
        this.enemies.forEach(enemy => enemy.registerClickHandler(handler));
    }

    public removeEnemyClickHandlers() {
        this.enemies.forEach(enemy => enemy.deregisterClickHandler());
    }
}

export class MenuItem {

    private readonly container: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene, x: number, y: number, public readonly menuText: string, 
        onClickHandler: Function) {

        this.container = scene.add.container(x, y);
        const background = scene.add.rectangle(0, 0, 150, 25, 0x000099);
        background.setOrigin(0, 0);
        background.setInteractive();

        background.on('pointerdown', () => onClickHandler(this));

        this.container.add(background);

        const text = scene.add.text(3, 5, menuText);
        text.setOrigin(0, 0);
        this.container.add(text);
    }

    destroy(): void {
        console.log("destroying item");
        this.container.destroy();
    }
}

export class DCharacter {

    private readonly container: Phaser.GameObjects.Container;
    private readonly background: Phaser.GameObjects.Rectangle;
    private readonly hpText: Phaser.GameObjects.Text;

    private readonly name: string
    private hp: number;

    private readonly color: number;

    private readonly isEnemy: boolean;

    public constructor(scene: Phaser.Scene, name: string, x: number, y: number, isEnemy: boolean) {
        this.name = name;

        this.container = scene.add.container(x, y);
        this.isEnemy = isEnemy;
        this.color = isEnemy ? 0xFF0000 : 0x0000FF;

        this.background = scene.add.rectangle(0, 0, 250, 100, this.color);
        this.background.setOrigin(0, 0);
        this.background.setInteractive();
        this.container.add(this.background);

        const txt = scene.add.text(5, 5, name);
        txt.setOrigin(0, 0);
        this.container.add(txt);

        this.hpText = scene.add.text(5, 20, "");
        this.hpText.setOrigin(0, 0);
        this.container.add(this.hpText);

        this.setHP(100);
    }

    public getHp(): number {
        return this.hp;
    }

    public setHP(value: number): void {
        this.hp = value;
        this.hpText.setText(`HP: ${value}/100`);
    }

    public activate(): void {
        this.background.fillColor = 0x00FF00;
    }

    public deactivate(): void {
        this.background.fillColor = this.color;
    }

    public getMenuItems(): string[] {
        return ["attack", "attack2"];
    }

    public registerClickHandler(handler: Function): void {
        this.background.on('pointerdown', () => {
            handler(this);
        });
    }

    public deregisterClickHandler(): void {
        this.background.off('pointerdown');
    }

    public getName(): string {
        return this.name;
    }
    
    public getIsEnemy(): boolean {
        return this.isEnemy;
    }

    public getPosition(): Phaser.Math.Vector2 {
        let pos = this.background.getCenter();
        pos.x += this.container.x;
        pos.y += this.container.y;
        return pos;
    }
}