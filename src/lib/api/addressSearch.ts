import { api } from "../axios";


export interface addressSearchResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  erro?: boolean;
}

export async function addressSearch(
  uf: string,
  cidade: string,
  logradouro: string
): Promise<addressSearchResponse[]> {
  const response = await api.get<addressSearchResponse[]>(
    `/${uf}/${cidade}/${logradouro}/json/`
  );
  if (
    !response.data ||
    (Array.isArray(response.data) && response.data.length === 0)
  ) {
    throw new Error("Endereço não encontrado");
  }
  return response.data;
}
