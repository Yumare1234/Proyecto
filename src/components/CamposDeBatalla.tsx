import { useParams } from "react-router";
function CampoDeBatalla() {
    const { id1, id2 } = useParams();

const [carta1, setCarta1] = useState<Carta | null>(null);
const [carta2, setCarta2] = useState<Carta | null>(null);
const [error, setError] = useState<string | null>(null);

    const getCarta = async(id: string): Promise<Carta> => {
        const urlAPI = `https://educa-api.onrender.com/card/${id}`;
        const respuesta = await fetch(urlAPI, {
            
        )