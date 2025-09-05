
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Image } from "lucide-react";

interface ImageFormProps {
  formData: {
    cover_image_url: string;
    gallery_images?: string[];
  };
  setFormData: (data: any) => void;
}

const ImageForm = ({ formData, setFormData }: ImageFormProps) => {
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const galleryImages = formData.gallery_images || [];

  const addImageToGallery = () => {
    if (newImageUrl.trim()) {
      const updatedImages = [...galleryImages, newImageUrl.trim()];
      setFormData({...formData, gallery_images: updatedImages});
      setNewImageUrl('');
    }
  };

  const removeImageFromGallery = (index: number) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setFormData({...formData, gallery_images: updatedImages});
  };

  return (
    <div className="space-y-6">
      {/* Kapak Resmi */}
      <div>
        <Label htmlFor="cover_image_url">Kapak Resmi URL'si *</Label>
        <Input
          id="cover_image_url"
          value={formData.cover_image_url}
          onChange={(e) => setFormData({...formData, cover_image_url: e.target.value})}
          placeholder="Ana kapak resmi URL'si girin"
          className="mt-1"
        />
        {formData.cover_image_url && (
          <div className="mt-2">
            <img 
              src={formData.cover_image_url} 
              alt="Kapak resmi önizleme" 
              className="w-full h-32 object-cover rounded-md border"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Fotoğraf Galerisi */}
      <div>
        <Label className="text-base font-medium">Fotoğraf Galerisi</Label>
        <p className="text-sm text-muted-foreground mb-3">
          İşletmenizi tanıtan ek fotoğraflar ekleyin
        </p>
        
        {/* Yeni fotoğraf ekleme */}
        <div className="flex gap-2 mb-4">
          <Input
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Fotoğraf URL'si girin"
            onKeyPress={(e) => e.key === 'Enter' && addImageToGallery()}
          />
          <Button 
            type="button" 
            onClick={addImageToGallery}
            variant="outline"
            size="icon"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Galeri fotoğrafları */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <img 
                    src={imageUrl} 
                    alt={`Galeri fotoğrafı ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImageFromGallery(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Image className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">Henüz galeri fotoğrafı eklenmedi</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageForm;
