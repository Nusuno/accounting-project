'use server'

export async function Login(username: string, password: string) {

    if (username === 'test' && password === '1234') {
        return true;
    } else {
        return false;
    }
}