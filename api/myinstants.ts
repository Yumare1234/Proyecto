import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ error: 'Falta el parámetro name' });
        }

        // Aseguramos que name sea string
        const termino = Array.isArray(name) ? name[0] : name;

        const apiUrl = `https://www.myinstants.com/api/v1/instants/?format=json&page=1&name=${encodeURIComponent(termino)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        // Extraemos el mensaje de forma segura
        const mensaje = error instanceof Error ? error.message : String(error);
        const traza = error instanceof Error ? error.stack : undefined;

        res.status(500).json({
            error: 'Error interno de la función',
            message: mensaje,
            stack: traza,
        });
    }
}