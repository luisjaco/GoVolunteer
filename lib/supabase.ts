import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

/*
    REST API (Representational State Transfer Application Programming Interface): architecture style
    for designing networked applications. Basically a set of standards for an API (REST is the 
    standard).

    **Resource: an entity which can be acessed and manipulated indepentdently.

    REST STANDARDS:
    - Client-server architecture
    - Statelessness: each request contains all information needed. No client state is stored by 
    server
    - Cacheability: Responses can be cached to prevent clients from requesting the same data.
    - Layered System: A client can't tell whether its connected to the end server or intermediary.
    - Uniform Interface (important): sub-constraints:
        - Identification of resources: identified by URIs (Uniform Resource Identifiers)
        - Manipulation of resources through representations: clients will interact with resources by
        sending representations of the resources to the server with JSON or XML.
        - Self-descriptive messages: each message will describe how to process the message.
        - Hypermedia as the Engine of Application State (HATEOAS): server should provide links 
        within its responses to guide the client on available actions and transitions.
    
    HOW THEY ACTUALLY WORK:
    typically use HTTP methods (GET, POST, PUT, DELETE) to perform actions identified by URLS.
    methods are like CRUD operations (CREATE, READ, UPDATE, DELETE)
    - GET: Retrieves data from resource
    - POST: Creates a new resource
    - PUT: Updates an existing resource
    - DELETE: Removes a resource
*/