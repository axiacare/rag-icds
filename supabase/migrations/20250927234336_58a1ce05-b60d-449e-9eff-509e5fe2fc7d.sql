-- Remove the overly permissive policy that allows all authenticated users to view institutions
DROP POLICY IF EXISTS "Authenticated users can view institutions" ON public.institutions;

-- Create more secure policies that restrict access based on user roles and associations

-- Policy 1: Users can view institutions they are auditing
CREATE POLICY "Users can view institutions they audit" 
ON public.institutions 
FOR SELECT 
USING (
  -- Allow if user is an auditor for this institution
  EXISTS (
    SELECT 1 
    FROM audits 
    WHERE audits.institution_id = institutions.id 
    AND audits.auditor_id = auth.uid()
  )
);

-- Policy 2: Users can view institutions they are associated with through their profile
CREATE POLICY "Users can view their associated institution" 
ON public.institutions 
FOR SELECT 
USING (
  -- Allow if user's profile is associated with this institution
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.institution_id = institutions.id 
    AND profiles.user_id = auth.uid()
  )
);

-- Policy 3: Viewers with specific institution access (for future role-based access)
CREATE POLICY "Viewers can view accessible institutions" 
ON public.institutions 
FOR SELECT 
USING (
  -- Allow viewers who have specific institution access
  has_role(auth.uid(), 'viewer'::app_role) 
  AND (
    -- Either they're associated through their profile
    EXISTS (
      SELECT 1 
      FROM profiles 
      WHERE profiles.institution_id = institutions.id 
      AND profiles.user_id = auth.uid()
    )
    -- Or they have audit access to this institution
    OR EXISTS (
      SELECT 1 
      FROM audits 
      WHERE audits.institution_id = institutions.id 
      AND audits.auditor_id = auth.uid()
    )
  )
);

-- The existing admin policy remains unchanged and provides full access to admins