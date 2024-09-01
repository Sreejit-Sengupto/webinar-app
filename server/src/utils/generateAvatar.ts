import crypto from 'node:crypto'
export const generateAvatar = (email: string) => {
    const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex')
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}