const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Hardcoded response data for Udiliv 300
const fakeResponse = {
  fakeVision: true,
  medicine: {
    medication: {
      medicine_name: "Udiliv 300",
      current_market_price: "₹185.50 per strip",
      dosage_form: "Tablet",
      standard_dosage: "300mg once daily"
    },
    usage: {
      when_to_take: "Take with food, preferably in the morning",
      common_uses: "Primary Biliary Cholangitis (PBC), Gallstone dissolution",
      contraindications: "Severe liver disease, Complete biliary obstruction",
      major_side_effects: "Nausea, Diarrhea, Stomach pain, Headache"
    },
    storage: {
      storage_conditions: "Store below 25°C in a dry place, protected from light"
    },
    additional: {
      precautions: "Regular liver function monitoring required. Avoid alcohol.",
      alternatives: "Ursocol, Udikind, Ursobile"
    }
  },
  pharmacies: [
    {
      name: "HealthMart Pharmacy",
      address: "Phase 3B2, Near Franco Hotel, Mohali",
      distance: "0.5 km",
      phone: "+91-172-5012345",
      stock: true,
      price: 185.50
    },
    {
      name: "MediCare Plus",
      address: "Sector 70, Near Baskin Robbins, Mohali",
      distance: "1.2 km",
      phone: "+91-172-5067890",
      stock: true,
      price: 189.00
    },
    {
      name: "Apollo Pharmacy",
      address: "Phase 5, Near Pizza Hut, Mohali",
      distance: "2.1 km",
      phone: "+91-172-5089012",
      stock: false,
      price: 183.00
    }
  ]
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { image_url } = await req.json();

    // Validate image_url
    if (!image_url) {
      return new Response(
        JSON.stringify({ 
          error: 'Image URL is required'
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 400
        }
      );
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return new Response(
      JSON.stringify(fakeResponse),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process image',
        details: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500
      }
    );
  }
});