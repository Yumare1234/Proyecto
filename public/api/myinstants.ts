import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Falta el parámetro name' });
    }

    try {
        const apiUrl = `https://www.myinstants.com/api/v1/instants/?format=json&page=1&name=${encodeURIComponent(String(name))}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error al buscar en MyInstants:', error);
        res.status(500).json({ error: 'Error al conectar con MyInstants' });
    }
}