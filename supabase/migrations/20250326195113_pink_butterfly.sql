/*
  # Create pet health records schema

  1. New Tables
    - `pets`
      - Basic pet information
      - Photo storage
      - Owner relationship
    - `health_records`
      - Detailed health information
      - Activity and behavioral data
      - Environmental factors
    - `health_predictions`
      - AI-generated health predictions
      - Risk assessments
      - Recommendations

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  species text NOT NULL,
  breed text,
  birth_date date,
  gender text,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id uuid REFERENCES pets(id) ON DELETE CASCADE,
  weight numeric NOT NULL,
  weight_unit text NOT NULL,
  body_condition text NOT NULL,
  activity_duration integer,
  activity_types text[],
  food_type text,
  meals_per_day integer,
  portion_size text,
  food_allergies text[],
  treats_per_day integer,
  chronic_conditions text[],
  medications text[],
  surgery_history text[],
  last_checkup date,
  unusual_behaviors text[],
  behavioral_issues text[],
  energy_level text,
  environment text,
  water_access boolean,
  hazards text[],
  vaccinated boolean,
  preventive_care boolean,
  last_dental date,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create health predictions table
CREATE TABLE IF NOT EXISTS health_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  health_record_id uuid REFERENCES health_records(id) ON DELETE CASCADE,
  prediction_text text NOT NULL,
  risk_factors text[],
  recommendations text[],
  severity text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_predictions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own pets"
  ON pets
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their pets' health records"
  ON health_records
  USING (pet_id IN (
    SELECT id FROM pets WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can view their pets' health predictions"
  ON health_predictions
  USING (health_record_id IN (
    SELECT hr.id FROM health_records hr
    JOIN pets p ON hr.pet_id = p.id
    WHERE p.user_id = auth.uid()
  ));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();