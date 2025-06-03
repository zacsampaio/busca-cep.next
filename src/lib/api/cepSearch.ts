import { api } from "../axios";

export interface CepSearchResponse {
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

export async function cepSearch(cep: string): Promise<CepSearchResponse> {
  const formattedCep = cep.replace(/\D/g, "");
  const response = await api.get<CepSearchResponse>(`/${formattedCep}/json/`);
  if(response.data.erro){
    throw new Error("CEP not found");
  }
  return response.data;
}
