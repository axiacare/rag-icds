import React, { useState } from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Building } from "lucide-react";
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

  const handleInputChange = (field: keyof InstitutionData, value: any) => {
    const newData = { ...institutionData, [field]: value };
    setInstitutionData(newData);
    onDataChange(newData);
  };

  return (
    <Card className="shadow-card border-0 bg-gradient-to-br from-card to-card/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl text-foreground flex items-center gap-3">
          <div className="p-2 bg-gradient-medical rounded-lg">
            <Building className="w-5 h-5 text-white" />
          </div>
          Dados da Instituição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Institution Identification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="institution-name" className="text-sm font-medium">
              Nome da Instituição <span className="text-destructive">*</span>
            </Label>
            <Input
              id="institution-name"
              placeholder="Digite o nome da instituição..."
              value={institutionData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="registration-number" className="text-sm font-medium">
              Número de Cadastro <span className="text-destructive">*</span>
            </Label>
            <Input
              id="registration-number"
              placeholder="Digite o número de cadastro..."
              value={institutionData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Audit Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Data da Auditoria <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !institutionData.auditDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {institutionData.auditDate ? (
                  format(institutionData.auditDate, "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione a data da auditoria</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-50" align="start">
              <Calendar
                mode="single"
                selected={institutionData.auditDate}
                onSelect={(date) => handleInputChange('auditDate', date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Auditors */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Auditores <span className="text-destructive">*</span>
          </Label>
          <MultiSelect
            options={auditorOptions}
            selected={institutionData.auditors}
            onChange={(auditors) => handleInputChange('auditors', auditors)}
            placeholder="Selecione os auditores..."
          />
        </div>

        {/* Sector Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Áreas desta Auditoria</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {hospitalSectors.map((sector) => (
              <div key={sector.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`sector-${sector.id}`}
                  checked={selectedSectors.includes(sector.id)}
                  onCheckedChange={() => onSectorToggle(sector.id)}
                />
                <Label 
                  htmlFor={`sector-${sector.id}`} 
                  className="text-sm cursor-pointer leading-tight flex-1"
                >
                  {sector.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selecione as áreas que serão auditadas nesta instituição
          </p>
        </div>
      </CardContent>
    </Card>
  );
}