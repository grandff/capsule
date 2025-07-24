-- Fix settings trigger to handle existing records
-- This migration updates the create_default_settings function to use ON CONFLICT DO NOTHING

CREATE OR REPLACE FUNCTION create_default_settings()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
    -- Insert default settings for the new profile (ignore if already exists)
    INSERT INTO public.setting (
        profile_id,
        theme,
        font_size,
        color_blind_mode,
        created_at,
        updated_at
    ) VALUES (
        NEW.profile_id,
        'system',
        'default',
        false,
        NOW(),
        NOW()
    )
    ON CONFLICT (profile_id) DO NOTHING;
    
    RETURN NEW; -- Return the profile record that triggered this function
END;
$$; 