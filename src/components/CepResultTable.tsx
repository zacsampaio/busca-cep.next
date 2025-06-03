"use client";
import { TableCell, TableRow } from "@/components/ui/table";

interface CepResultTableProps {
  data: {
    cep: string;
    logradouro: string;
    complemento?: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
}

export function CepResultTable({ data }: CepResultTableProps) {
  return (
    <TableRow key={data.cep}>
      <TableCell>{data.cep}</TableCell>
      <TableCell>{data.logradouro}</TableCell>
      <TableCell>{data.complemento || "-"}</TableCell>
      <TableCell>{data.bairro}</TableCell>
      <TableCell>{data.localidade}</TableCell>
      <TableCell>{data.uf}</TableCell>
    </TableRow>
  );
}
