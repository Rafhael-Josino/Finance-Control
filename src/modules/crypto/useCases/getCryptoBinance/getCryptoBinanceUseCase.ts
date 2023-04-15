import { Spot } from '@binance/connector';
import { BinanceAsset } from '@modules/crypto/infra/models/CryptoTypes';
import dotenv from 'dotenv';

class GetCryptoBinanceUseCase {
    private apiKey = process.env.APIKEY;
    private apiSecret = process.env.APISECRET;
    
    async execute(): Promise<BinanceAsset[]> {
        console.log('teste')

        try {
            const client = new Spot(this.apiKey, this.apiSecret);

            const { data } = await client.account();
            const assets = data.balances.filter(asset => Number(asset.free));

            console.log(assets);

            return assets;
        } catch(err) {
            console.log("error:");
            console.log(err);
        }
    }
}

export { GetCryptoBinanceUseCase }