// this will hold functions for making requests to the supabase db. - luis

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qvtxjpbtjkqwvoyejcjy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

