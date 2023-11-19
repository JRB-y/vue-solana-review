import * as borsh from '@project-serum/borsh'
import { Buffer } from 'buffer'

export class Review {
    name: string
    message: string

    constructor (name: string, message: string) {
        this.name = name
        this.message = message
    }


    borseInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.str('name'),
        borsh.str('message'),
    ])


    serialize (): Buffer {
        window.Buffer = Buffer
        const buffer = Buffer.alloc(1000)
        this.borseInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borseInstructionSchema.getSpan(buffer))
    }

    static decerialize (buffer: Buffer): Review | null {
        if (!buffer) return null

        try {
            const { name, message } = this.borshAccountSchema.decode(buffer)
            return new Review(name, message)
        } catch (e) {
            console.log('Deserialization error:', e)
            console.log(buffer)
            return null
        }
    }


}