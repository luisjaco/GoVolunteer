// this will hold functions for making requests to the supabase db. - luis

import { createClient } from '@supabase/supabase-js';
const supabaseUrl = 'https://qvtxjpbtjkqwvoyejcjy.supabase.co';

// safe, public key;
const publishableKey = "sb_publishable_1N-CrwAVxfsFxBdbkH7d7w_1Xa5axXN";
const supabase = createClient(supabaseUrl, publishableKey);

export default supabase;

export type Organization = {
    id: string,
    title: string,
    motto?: string,
    phone: string,
    organization_url: string,
    state: string,
    city: string,
    address?: string
    description?: string,
    profile_picture_url?: string
};

export type User = {
    id: string,
    email: string,
    is_organization: boolean
};