import es from "@elastic/elasticsearch";

export class Search {
  public es: es.Client;
  constructor() {
    this.es = new es.Client();
  }
}
