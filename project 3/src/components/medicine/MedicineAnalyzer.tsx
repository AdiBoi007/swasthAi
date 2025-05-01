import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, MapPin, Phone, AlertTriangle, Pill, Clock, Shield, Thermometer, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MedicineInfo {
  medication: {
    medicine_name: string;
    current_market_price: string;
    dosage_form: string;
    standard_dosage: string;
  };
  usage: {
    when_to_take: string;
    common_uses: string;
    contraindications: string;
    major_side_effects: string;
  };
  storage: {
    storage_conditions: string;
  };
  additional: {
    precautions: string;
    alternatives: string;
  };
}

interface Pharmacy {
  name: string;
  address: string;
  distance: string;
  phone: string;
  stock: boolean;
  price: number;
}

interface AnalysisResponse {
  medicine: MedicineInfo;
  pharmacies: Pharmacy[];
  fakeVision?: boolean;
}

const MedicineAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [medicineInfo, setMedicineInfo] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMedicine = async () => {
    if (!imagePreview) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/medicine`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imagePreview }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze medicine');
      }

      const data = await response.json();
      setMedicineInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Medicine Identifier</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="medicine-image"
              />
              <label
                htmlFor="medicine-image"
                className={cn(
                  "block w-full aspect-video rounded-xl border-2 border-dashed",
                  "flex items-center justify-center cursor-pointer",
                  "transition-colors duration-200",
                  imagePreview
                    ? "border-primary-300 bg-primary-50"
                    : "border-gray-300 hover:border-primary-300 hover:bg-gray-50"
                )}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Selected medicine"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      Upload a clear image of the medicine
                    </p>
                  </div>
                )}
              </label>
            </div>

            <button
              onClick={analyzeMedicine}
              disabled={!imagePreview || analyzing}
              className={cn(
                "w-full py-3 px-4 rounded-xl font-medium text-white",
                "transition duration-200",
                analyzing || !imagePreview
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary-600 hover:bg-primary-700"
              )}
            >
              {analyzing ? "Analyzing..." : "Analyze Medicine"}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-error-50 text-error-700 rounded-lg flex items-center gap-2">
                <AlertTriangle size={20} />
                <p>{error}</p>
              </div>
            )}
          </div>

          {medicineInfo && (
            <div className="space-y-6">
              {medicineInfo.fakeVision && (
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 flex items-center gap-2 text-sm text-warning-700">
                  <AlertCircle size={16} />
                  <p>Simulated analysis for demo purposes</p>
                </div>
              )}
              
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <Pill className="h-6 w-6 text-primary-500" />
                  <h3 className="text-xl font-semibold">{medicineInfo.medicine.medication.medicine_name}</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Price</p>
                      <p className="text-lg font-semibold text-primary-600">
                        {medicineInfo.medicine.medication.current_market_price}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-600">Form</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {medicineInfo.medicine.medication.dosage_form}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary-500" />
                      <h4 className="font-medium text-gray-900">Usage Guidelines</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">When to Take:</span> {medicineInfo.medicine.usage.when_to_take}</p>
                      <p><span className="font-medium">Common Uses:</span> {medicineInfo.medicine.usage.common_uses}</p>
                      <p><span className="font-medium">Standard Dosage:</span> {medicineInfo.medicine.medication.standard_dosage}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-warning-500" />
                      <h4 className="font-medium text-gray-900">Safety Information</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Contraindications:</span> {medicineInfo.medicine.usage.contraindications}</p>
                      <p><span className="font-medium">Side Effects:</span> {medicineInfo.medicine.usage.major_side_effects}</p>
                      <p><span className="font-medium">Precautions:</span> {medicineInfo.medicine.additional.precautions}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="h-5 w-5 text-secondary-500" />
                      <h4 className="font-medium text-gray-900">Storage & Additional Info</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Storage:</span> {medicineInfo.medicine.storage.storage_conditions}</p>
                      <p><span className="font-medium">Alternatives:</span> {medicineInfo.medicine.additional.alternatives}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Available at Nearby Pharmacies</h3>
                
                <div className="space-y-4">
                  {medicineInfo.pharmacies.map((pharmacy, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{pharmacy.name}</h4>
                        <div className="mt-1 space-y-1 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin size={16} className="mr-1" />
                            {pharmacy.address}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone size={16} className="mr-1" />
                            {pharmacy.phone}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-medium">₹{pharmacy.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-600">{pharmacy.distance}</div>
                        <div className={cn(
                          "text-sm mt-1",
                          pharmacy.stock ? "text-success-600" : "text-error-600"
                        )}>
                          {pharmacy.stock ? "In Stock" : "Out of Stock"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicineAnalyzer;