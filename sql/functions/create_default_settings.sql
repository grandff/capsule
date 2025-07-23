/**
 * Database Trigger Function: create_default_settings
 * 
 * This function is triggered after a new profile is inserted into the public.profiles table.
 * It automatically creates a corresponding settings record in the public.setting table
 * with default values for theme, font size, and color blind mode.
 * 
 * The function ensures that every user has a settings record with sensible defaults:
 * - theme: 'dark' (dark theme by default)
 * - font_size: 'default' (16px)
 * - color_blind_mode: false (disabled by default)
 * 
 * Security considerations:
 * - Uses SECURITY DEFINER to run with the privileges of the function owner
 * - Sets an empty search path to prevent search path injection attacks
 * 
 * @returns TRIGGER - Returns the NEW record that triggered the function
 */
CREATE OR REPLACE FUNCTION create_default_settings()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET SEARCH_PATH = ''
AS $$
BEGIN
    -- Insert default settings for the new profile
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
    );
    
    RETURN NEW; -- Return the profile record that triggered this function
END;
$$;

/**
 * Database Trigger: create_default_settings
 * 
 * This trigger executes the create_default_settings function automatically
 * after a new profile is inserted into the public.profiles table.
 * 
 * The trigger runs once for each row inserted (FOR EACH ROW)
 * and only activates on INSERT operations, not on UPDATE or DELETE.
 */
CREATE TRIGGER create_default_settings
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION create_default_settings(); 