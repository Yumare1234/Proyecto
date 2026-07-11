// api/myinstants.js
export default async function handler(req, res) {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Falta el parámetro name' });
        }

        const termino = Array.isArray(name) ? name[0] : name;
        const apiUrl = `https://www.myinstants.com/api/v1/instants/?format=json&page=1&name=${encodeURIComponent(termino)}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
            },
        });

        const text = await response.text(); // Obtenemos el contenido como texto

        // Intentamos parsear JSON de todas formas, pero si falla, mostramos el texto
        let data;
        try {
            data = JSON.parse(text);
            res.status(200).json(data);
        } catch (jsonError) {
            // Devolvemos el HTML recibido para diagnóstico
            res.status(500).json({
                error: 'MyInstants devolvió HTML en lugar de JSON',
                html: text.substring(0, 500), // Primeros 500 caracteres
            });
        }
    } catch (error) {
        const mensaje = error instanceof Error ? error.message : String(error);
        res.status(500).json({ error: 'Error interno', message: mensaje });
    }
}