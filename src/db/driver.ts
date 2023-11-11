import type { CompiledQuery, DatabaseConnection, Driver, QueryResult } from "kysely";

export interface FetchDriverConfig {
  url: string;
  authorization: string;
  transformer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    serialize: (value: any) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    deserialize: (str: string) => any;
  };
}

export class FetchDriver implements Driver {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  async init(): Promise<void> {
    // Nothing to do here.
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async acquireConnection(): Promise<DatabaseConnection> {
    return new FetchConnection(this.config);
  }

  async beginTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async commitTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async rollbackTransaction(): Promise<void> {
    // Nothing to do here.
  }

  async releaseConnection(): Promise<void> {
    // Nothing to do here.
  }

  async destroy(): Promise<void> {
    // Nothing to do here.
  }
}

class FetchConnection implements DatabaseConnection {
  config: FetchDriverConfig;

  constructor(config: FetchDriverConfig) {
    this.config = config;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    throw new Error("FetchConnection does not support streaming");
  }

  async executeQuery<R>(compiledQuery: CompiledQuery): Promise<QueryResult<R>> {
    const body = {
      sql: compiledQuery.sql,
      parameters: compiledQuery.parameters,
    };
    const res = await fetch(this.config.url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "text/plain",
        "Authorization": this.config.authorization,
      },
      body: this.config.transformer.serialize(body),
    });

    if (res.ok) {
      try {
        const result = this.config.transformer.deserialize(await res.text());
        return result;
      } catch (error) {
        throw new Error("failed to parse response");
      }
    } else {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  }
}
