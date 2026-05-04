export type PaletteCommand = {
  label: string;
  keywords: string;
  run: () => void;
};

export class CommandPalette {
  private overlay: HTMLElement;
  private input: HTMLInputElement;
  private list: HTMLElement;
  private commands: PaletteCommand[];
  private selected = 0;

  constructor(commands: PaletteCommand[]) {
    this.commands = commands;
    this.overlay = document.createElement("div");
    this.overlay.className = "palette-overlay";
    this.overlay.innerHTML = `
      <div class="palette">
        <input placeholder="Type a command..." autocomplete="off" />
        <div class="palette-list"></div>
      </div>
    `;
    this.input = this.overlay.querySelector("input") as HTMLInputElement;
    this.list = this.overlay.querySelector(".palette-list") as HTMLElement;
    document.body.append(this.overlay);
    this.bind();
    this.render();
  }

  open() {
    this.overlay.classList.add("visible");
    this.input.value = "";
    this.selected = 0;
    this.render();
    this.input.focus();
  }

  close() {
    this.overlay.classList.remove("visible");
  }

  private bind() {
    this.overlay.addEventListener("click", (event) => {
      if (event.target === this.overlay) this.close();
    });
    this.input.addEventListener("input", () => {
      this.selected = 0;
      this.render();
    });
    this.input.addEventListener("keydown", (event) => {
      const results = this.results();
      if (event.key === "Escape") this.close();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        this.selected = Math.min(results.length - 1, this.selected + 1);
        this.render();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        this.selected = Math.max(0, this.selected - 1);
        this.render();
      }
      if (event.key === "Enter" && results[this.selected]) {
        results[this.selected].run();
        this.close();
      }
    });
  }

  private render() {
    const results = this.results();
    this.list.innerHTML = results
      .map((command, index) => `<button class="${index === this.selected ? "selected" : ""}" data-index="${index}">${command.label}</button>`)
      .join("");
    this.list.querySelectorAll<HTMLButtonElement>("button").forEach((button) => {
      button.addEventListener("click", () => {
        const command = results[Number(button.dataset.index)];
        command.run();
        this.close();
      });
    });
  }

  private results() {
    const query = this.input.value.toLowerCase();
    return this.commands.filter((command) => `${command.label} ${command.keywords}`.toLowerCase().includes(query));
  }
}
