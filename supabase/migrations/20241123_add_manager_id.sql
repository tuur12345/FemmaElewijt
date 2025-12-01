-- Add manager_id column to activities table
ALTER TABLE activities 
ADD COLUMN manager_id UUID REFERENCES auth.users(id);

-- Update RLS policies for activities
-- Allow manager to update their own activities
CREATE POLICY "Managers can update their own activities"
ON activities
FOR UPDATE
USING (auth.uid() = manager_id);

-- Update RLS policies for registrations
-- Allow manager to view registrations for their activities
CREATE POLICY "Managers can view registrations for their activities"
ON registrations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM activities
    WHERE activities.id = registrations.activity_id
    AND activities.manager_id = auth.uid()
  )
);
