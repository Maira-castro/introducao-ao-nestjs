//Baixar i pacote do Cloudinary
//npm i cloudinary

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'
import { ImageObject } from './image-object';
import { resolve } from 'path';
import { rejects } from 'assert';
import { error } from 'console';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME_CLOUD,
    api_key: process.env.CLOUDINARY_KEY_API,
    api_secret: process.env.CLOUDINARY_SECRET_API
})


@Injectable()
export class CloudinaryService {

    async uploadImage(buffer: Buffer): Promise<ImageObject> {
        return new Promise((resolve, reject) => {
            const strem = cloudinary.uploader.upload_stream(
                { folder: 'places' }, (error, result) => { //esta criando a pasta no cloudinary
                    if (error || !result) return reject(error || new Error("Upload falhou"))
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id
                    })
                }
            )
            const readable = new Readable()
            readable.push(buffer)
            readable.push(null)
            readable.pipe(strem)
        })
    }

    async deleteImage(public_id: string): Promise<void> {
        await cloudinary.uploader.destroy(public_id)
    }
}