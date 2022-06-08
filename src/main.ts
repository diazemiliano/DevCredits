interface Options {
  linesHeight?: number;
  linesWidth?: number;
  initialPadding?: string;
  fillCharacter?: string;
  credits: Array<any>;
}

class OptionsDefaults implements Options {
  credits: Array<any> = [
    "Dev Credits",
    "Made with love just for fun.",
    "--",
    "Emiliano Díaz.",
    "Github: https://github.com/diazemiliano",
  ];
  fillCharacter: string = " ";
  initialPadding: string = " ";
  linesHeight: number = 15;
  linesWidth: number = 60;
}

class DevCredits {
  private readonly linesHeight: number;
  private readonly linesWidth: number;
  private readonly initialPadding: string;
  private readonly fillCharacter: string;
  private readonly progressBar: Comment;
  private readonly linesText: Array<any>;

  private status: boolean = false;
  private times: number = 0;
  private animationInterval: any = null;
  private credits: Array<any> = [];

  constructor(params = new OptionsDefaults()) {
    this.linesText = params.credits;
    this.linesHeight = params.linesHeight;
    this.linesWidth = params.linesWidth;
    this.initialPadding = params.initialPadding;
    this.fillCharacter = params.fillCharacter;
    this.progressBar = document.createComment("-".repeat(this.linesWidth));
  }

  private createTextLine = (
    text: string,
    fill: string = this.fillCharacter,
    padding: string = this.initialPadding
  ) => {
    text = padding + text;
    return text + fill.repeat(this.linesWidth - text.length);
  };

  private initCredits = () => {
    this.credits = [];
    this.times = 0;
    let i = 0;

    while (i < this.linesHeight) {
      this.credits[i] = document.createComment(" ".repeat(this.linesWidth));
      i++;
    }

    this.credits.push(
      this.progressBar,
      document.createComment(
        this.createTextLine(
          `Check "DevCredits (Object)" at console for more commands.`
        )
      )
    );
  };

  private renderCredits = () => {
    let i = 0;

    while (i < this.credits.length) {
      document.appendChild(this.credits[i]);
      i++;
    }
  };

  private animateCredits = () => {
    let i = 0;

    while (i < this.linesHeight) {
      const text = this.linesText[this.times - i] || "";
      this.credits[this.linesHeight - 1 - i].textContent =
        this.createTextLine(text);
      i++;
    }

    this.times++;

    const creditsPlayedPercentage = Math.round(
      (this.times * 100) / (this.linesHeight + this.linesText.length)
    );
    const barProgress = Math.round(
      (creditsPlayedPercentage * this.linesWidth) / 100
    );
    const barPercentage = Math.round((barProgress * 100) / 60);
    const barPercentageLabel = `[ ${barPercentage}% ]`;
    const barText =
      "=".repeat(barProgress) + "-".repeat(this.linesWidth - barProgress);
    const barPercentageLeftCenter = Math.floor(
      (this.linesWidth - barPercentageLabel.length) / 2
    );
    const barPercentageRightCenter =
      barPercentageLeftCenter + barPercentageLabel.length;
    const barProgressTextLine =
      barText.substring(0, barPercentageLeftCenter) +
      barPercentageLabel +
      barText.substring(barPercentageRightCenter, barText.length);

    this.progressBar.textContent = barProgressTextLine;
    if (this.linesHeight + this.linesText.length - this.times === 0) {
      this.times = 0;
    }
  };

  private removeCredits = () => {
    let i = 0;
    while (i < this.credits.length) {
      this.credits[i].remove();
      i++;
    }

    this.credits = [];
  };

  start = () => {
    if (!this.status) return this;
    if (this.animationInterval) stop();
    this.animationInterval = setInterval(this.animateCredits, 750);
    return this;
  };

  stop = () => {
    if (!this.status) return this;
    clearInterval(this.animationInterval);
    this.animationInterval = null;
    return this;
  };

  mount = () => {
    if (this.status) return this;
    this.initCredits();
    this.renderCredits();
    this.status = true;
    return this;
  };

  unmount = () => {
    if (!this.status) return this;
    this.stop();
    this.removeCredits();
    this.status = false;
    return this;
  };
}

export { DevCredits, OptionsDefaults };
