"use client";

import { CepResultTable } from "@/components/CepResultTable";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addressSearch } from "@/lib/api/addressSearch";
import { cepSearch, CepSearchResponse } from "@/lib/api/cepSearch";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const cepSchema = z
  .string()
  .regex(
    /^\d{2}[-.]?\d{3}[-.]?\d{3}$/,
    "Por favor, digite um CEP válido com 8 números. Pode usar ponto ou hífen."
  );

export default function Home() {
  const [searchType, setSearchType] = useState<"cep" | "endereco">("cep");
  const [cep, setCep] = useState<string>("");
  const [uf, setUf] = useState<string>("");
  const [cidade, setCidade] = useState<string>("");
  const [logradouro, setLogradouro] = useState<string>("");
  const [results, setResults] = useState<CepSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function normalizeCep(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 8) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})/, "$1.$2-$3");
    }
    return value;
  }

  function formatCepInput(value: string){
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return digits.replace(/(\d{2})(\d{0,3})/, "$1.$2");
    return digits.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2-$3");
  }

  const queryClient = useQueryClient();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResults([]);

    if (searchType === "cep") {
      const result = cepSchema.safeParse(cep);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }

      const normalizedCep = normalizeCep(cep);
      setCep(normalizedCep);
      setIsLoading(true)

      queryClient
        .fetchQuery({
          queryKey: ["cep", normalizedCep],
          queryFn: () => cepSearch(normalizedCep),
        })
        .then((res) => {
          setResults((prev) => [...prev, res]);
        })
        .catch((error) => {
          toast.error(
            "Não foi possível buscar o CEP: " +
              (error instanceof Error ? error.message : "Tente novamente.")
          );
        })
        .finally(() => setIsLoading(false));
    } else {
      if (!uf || !cidade || !logradouro) {
        toast.error("Preencha UF, Cidade e Logradouro.");
        return;
      }
      // Chame sua função addressSearch aqui
      addressSearch(uf, cidade, logradouro)
        .then((res) => setResults(res))
        .catch((error) =>
          toast.error(
            "Erro ao buscar endereço: " +
              (error instanceof Error ? error.message : "Tente novamente.")
          )
        );
    }
  }

  return (
    <>
      <Header />
      <div className="px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mt-20 gap-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-flex gap-2"
          >
            <Select
              value={searchType}
              onValueChange={(v) => setSearchType(v as "cep" | "endereco")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tipo de busca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cep">Buscar por CEP</SelectItem>
                <SelectItem value="endereco">Buscar por Endereço</SelectItem>
              </SelectContent>
            </Select>
            {searchType === "cep" ? (
              <Input
                id="cep"
                value={cep}
                onChange={(e) => setCep(formatCepInput(e.target.value))}
                placeholder="Digite o CEP"
                maxLength={10}
              />
            ) : (
              <>
                <Input
                  placeholder="UF"
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  maxLength={2}
                  className="w-16"
                />
                <Input
                  placeholder="Cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-40"
                />
                <Input
                  placeholder="Logradouro"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  className="w-56"
                />
              </>
            )}
            <Button
              disabled={
                isLoading ||
                (searchType === "cep" ? !cep : !uf || !cidade || !logradouro)
              }
              type="submit"
              className="cursor-pointer"
            >
              Buscar
            </Button>
          </form>
        </div>
        {results.length > 0 && (
          <Table className="min-w-[600px] w-full mx-auto mt-16 gap-6">
            <TableHeader>
              <TableRow>
                <TableHead>CEP</TableHead>
                <TableHead>Logradouro</TableHead>
                <TableHead>Complemento</TableHead>
                <TableHead>Bairro</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((data, index) => (
                <CepResultTable key={data.cep + index} data={data} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
