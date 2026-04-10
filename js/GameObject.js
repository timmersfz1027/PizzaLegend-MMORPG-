class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/img/characters/people/hero.png",
    });
    this.behaviorLoop = config.behaviorLoop || [];
    this.behaviorLoopIndex = 0;
  }
  mount(map) {
    console.log("Mounting with the map");
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // if we have a behavior, kick off after a short delay
    setTimeout(() => {
      this.doBehaviorEvent(map);
    }, 10);
  }

  update() {}
  async doBehaviorEvent(map) {
    // Don't do anything if there is a more important cutscene or we're not mounted on the map yet
    if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
      return;
    }
    //Setting up our event with relevant info
    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
    eventConfig.who = this.id;
    //Create an event instance out of our config, and wait for it to complete
    const eventHandler = new OverworldEvent({
      map,
      event: eventConfig,
    });
    await eventHandler.init();
    //Setting the next event to fire after this one is done
    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }

    //Do it again!
    this.doBehaviorEvent(map);
  }
}
