export class Logger {
  private file:Deno.FsFile;
  private prefix:string;

  constructor(file:Deno.FsFile, prefix:string){
    this.file = file;
    this.prefix = prefix;
  }
  static async getLogger(filePath:string, prefix:string){
    try {
      const file = await Deno.open(filePath, {write:true, read:true, create:true, append:false, truncate:true})
      return new Logger(file, prefix)
    } catch {
      throw new Error("Failed to open file.")
    }
  }
  private formatMessage(level:string, message:string):string {
    const now = new Date();
    const timestamp = now.toISOString();
    const location = this.getCallerLocation();
    return `${this.prefix} ${timestamp} ${level} ${location}:${message}\n`
  }
  private getCallerLocation(): string {
    const error = new Error();
    const stack = error.stack?.split("\n")[4]?.trim(); 
    return stack ? stack.replace(/^at\s+/, "") : "unknown location";
  }
  private async writeToFile(message: string): Promise<void> {
    const encoder = new TextEncoder();
    await this.file.write(encoder.encode(message));
  }
  public info(message:string):void {
    const formattedMessage = this.formatMessage("INFO", message);
    this.writeToFile(formattedMessage);
  }
  public error(message:string):void {
    const formattedMessage = this.formatMessage("ERROR", message);
    this.writeToFile(formattedMessage);
  }

  public warring(message:string):void {
    const formattedMessage = this.formatMessage("WARN", message);
    this.writeToFile(formattedMessage);
  }
  public close(): void {
    this.file.close();
  }
}

