import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { CosmosDelegation, CosmosAccount, CosmosBroadcastResult } from './models';
import { Query } from './Query';
import { CosmosAccountResult } from './models/CosmosAccount';
import { CosmosUnbond } from './models/CosmosUnbond';

export class CosmosRPC {
    rpcUrl: string;

    constructor(rpcUrl: string) {
        this.rpcUrl = rpcUrl;
    }

    private query(): Query {
        return new Query(this.rpcUrl);
    }

    async listDelegations(address: string): Promise<CosmosDelegation[]> {
        let response = await axios.get(this.query().listDelegations(address));
        return plainToClass<CosmosDelegation, any[]>(CosmosDelegation, response.data);
    }

    async listUnbondDelegations(address: string): Promise<CosmosUnbond[]> {
        let response = await axios.get(this.query().listUnbondDelegations(address));
        return plainToClass<CosmosUnbond, any[]>(CosmosUnbond, response.data);
    }

    async getAccount(address: string): Promise<CosmosAccount> {
        let response = await axios.get(this.query().getAccount(address));
        return plainToClass(CosmosAccountResult, response.data).value;
    }

    async broadcastTransaction(data: string): Promise<CosmosBroadcastResult> {
        const url = this.query().broadcastTransaction();
        const options = {
            validateStatus: (status: number) => {
                return status >= 200 && status < 500;
            },
        };
        const response = await axios.post(url, data, options);
        return plainToClass(CosmosBroadcastResult, response.data);
    }
}
