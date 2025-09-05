
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar } from "lucide-react";

interface WorkingHour {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface WorkingHoursFormProps {
  formData: {
    working_hours: string;
    detailed_hours?: WorkingHour[];
  };
  setFormData: (data: any) => void;
}

const DAYS = [
  { key: 'monday', label: 'Pazartesi' },
  { key: 'tuesday', label: 'Salı' },
  { key: 'wednesday', label: 'Çarşamba' },
  { key: 'thursday', label: 'Perşembe' },
  { key: 'friday', label: 'Cuma' },
  { key: 'saturday', label: 'Cumartesi' },
  { key: 'sunday', label: 'Pazar' }
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

const WorkingHoursForm = ({ formData, setFormData }: WorkingHoursFormProps) => {
  const [useDetailedHours, setUseDetailedHours] = useState(false);

  const defaultHours: WorkingHour[] = DAYS.map(day => ({
    day: day.key,
    isOpen: day.key !== 'sunday',
    openTime: '09:00',
    closeTime: '18:00'
  }));

  const detailedHours = formData.detailed_hours || defaultHours;

  const updateDayHours = (dayKey: string, updates: Partial<WorkingHour>) => {
    const updatedHours = detailedHours.map(day => 
      day.day === dayKey ? { ...day, ...updates } : day
    );
    setFormData({ ...formData, detailed_hours: updatedHours });
  };

  const generateSimpleHoursText = () => {
    const openDays = detailedHours.filter(day => day.isOpen);
    if (openDays.length === 0) return 'Kapalı';
    
    // Aynı saatlerde çalışan günleri grupla
    const groups: { [key: string]: string[] } = {};
    openDays.forEach(day => {
      const key = `${day.openTime}-${day.closeTime}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(DAYS.find(d => d.key === day.day)?.label || day.day);
    });

    return Object.entries(groups).map(([timeRange, days]) => {
      const dayRange = days.length > 1 ? `${days[0]}-${days[days.length - 1]}` : days[0];
      return `${dayRange} ${timeRange}`;
    }).join(', ');
  };

  React.useEffect(() => {
    if (useDetailedHours) {
      const simpleText = generateSimpleHoursText();
      setFormData({ ...formData, working_hours: simpleText });
    }
  }, [detailedHours, useDetailedHours]);

  return (
    <div className="space-y-6">
      {/* Basit Çalışma Saatleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Çalışma Saatleri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="working_hours">Çalışma Saatleri (Kısa Açıklama)</Label>
              <Input
                id="working_hours"
                value={formData.working_hours}
                onChange={(e) => setFormData({...formData, working_hours: e.target.value})}
                placeholder="Örn: Pazartesi-Cumartesi 09:00-18:00"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Bu metin ziyaretçilere gösterilecek
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="detailed-hours"
                checked={useDetailedHours}
                onCheckedChange={setUseDetailedHours}
              />
              <Label htmlFor="detailed-hours">Detaylı saat bilgisi ekle</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detaylı Çalışma Saatleri */}
      {useDetailedHours && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Günlük Çalışma Saatleri
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Her gün için ayrı çalışma saatleri belirleyin
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DAYS.map(({ key, label }) => {
                const dayHours = detailedHours.find(d => d.day === key) || defaultHours.find(d => d.day === key)!;
                
                return (
                  <div key={key} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center p-3 border rounded-lg">
                    <div className="font-medium">{label}</div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={dayHours.isOpen}
                        onCheckedChange={(checked) => updateDayHours(key, { isOpen: checked })}
                      />
                      <span className="text-sm">{dayHours.isOpen ? 'Açık' : 'Kapalı'}</span>
                    </div>

                    {dayHours.isOpen && (
                      <>
                        <div>
                          <Label className="text-xs">Açılış</Label>
                          <Select
                            value={dayHours.openTime}
                            onValueChange={(value) => updateDayHours(key, { openTime: value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Kapanış</Label>
                          <Select
                            value={dayHours.closeTime}
                            onValueChange={(value) => updateDayHours(key, { closeTime: value })}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {TIME_OPTIONS.map(time => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Öğle Molası</Label>
                          <div className="flex gap-1">
                            <Select
                              value={dayHours.breakStart || ''}
                              onValueChange={(value) => updateDayHours(key, { breakStart: value })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Başlangıç" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="">Yok</SelectItem>
                                {TIME_OPTIONS.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {dayHours.breakStart && (
                              <Select
                                value={dayHours.breakEnd || ''}
                                onValueChange={(value) => updateDayHours(key, { breakEnd: value })}
                              >
                                <SelectTrigger className="h-8 text-xs">
                                  <SelectValue placeholder="Bitiş" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map(time => (
                                    <SelectItem key={time} value={time}>{time}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {dayHours.breakStart && dayHours.breakEnd
                            ? `${dayHours.openTime}-${dayHours.breakStart}, ${dayHours.breakEnd}-${dayHours.closeTime}`
                            : `${dayHours.openTime}-${dayHours.closeTime}`
                          }
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkingHoursForm;
