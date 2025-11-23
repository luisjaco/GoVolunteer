// this will hold functions for making requests to the supabase db. - luis

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qvtxjpbtjkqwvoyejcjy.supabase.co';

// safe, public key;
const publishableKey = "sb_publishable_1N-CrwAVxfsFxBdbkH7d7w_1Xa5axXN"
const supabase = createClient(supabaseUrl, publishableKey)

export default supabase;