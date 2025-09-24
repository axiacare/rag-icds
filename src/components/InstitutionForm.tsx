import React, { useState } from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect, Option } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { hospitalSectors } from '@/data/sectors';

interface InstitutionData {
  name: string;
  registrationNumber: string;
  auditDate: Date | undefined;
  auditors: string[];
  selectedSectors: number[];
}

interface InstitutionFormProps {
  onDataChange: (data: InstitutionData) => void;
  selectedSectors: number[];
  onSectorToggle: (sectorId: number) => void;
}

const auditorOptions: Option[] = [
  { label: "Dr. Ana Silva", value: "ana-silva" },
  { label: "Dr. Carlos Santos", value: "carlos-santos" },
  { label: "Dra. Maria Oliveira", value: "maria-oliveira" },
  { label: "Dr. João Pereira", value: "joao-pereira" },
  { label: "Dra. Paula Costa", value: "paula-costa" },
  { label: "Dr. Ricardo Lima", value: "ricardo-lima" },
];

export default function InstitutionForm({ onDataChange, selectedSectors, onSectorToggle }: InstitutionFormProps) {
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    name: '',
    registrationNumber: '',
    auditDate: undefined,
    auditors: [],
    selectedSectors: selectedSectors,
  });

  const updateData = (updates: Partial<InstitutionData>) => {
    const newData = { ...institutionData, ...updates };
    setInstitutionData(newData);
    onDataChange(newData);
  };

  const handleSectorChange = (sectorId: number, checked: boolean) => {
    onSectorToggle(sectorId);
    const newSelectedSectors = checked 
      ? [...selectedSectors, sectorId]
      : selectedSectors.filter(id => id !== sectorId);
    
    updateData({ selectedSectors: newSelectedSectors });
  };

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Dados da Instituição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Institution Name and Registration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name">Identificação da Instituição</Label>
            <Input
              id="institution-name"
              value={institutionData.name}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="Nome da instituição"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-number">Número de Cadastro</Label>
            <Input
              id="registration-number"
              value={institutionData.registrationNumber}
              onChange={(e) => updateData({ registrationNumber: e.target.value })}
              placeholder="Ex: CNES 123456"
            />
          </div>
        </div>

        {/* Audit Date */}
        <div className="space-y-2">
          <Label>Data da Auditoria</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !institutionData.auditDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {institutionData.auditDate ? (
                  format(institutionData.auditDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={institutionData.auditDate}
                onSelect={(date) => updateData({ auditDate: date })}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Auditors */}
        <div className="space-y-2">
          <Label>Nome dos Auditores</Label>
          <MultiSelect
            options={auditorOptions}
            selected={institutionData.auditors}
            onChange={(auditors) => updateData({ auditors })}
            placeholder="Selecione os auditores..."
          />
        </div>

        {/* Sector Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Áreas desta Auditoria</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitalSectors.map((sector) => (
              <div key={sector.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector.id}`}
                  checked={selectedSectors.includes(sector.id)}
                  onCheckedChange={(checked) => 
                    handleSectorChange(sector.id, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`sector-${sector.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {sector.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}