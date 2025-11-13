// fucking around with supabase...

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://qvtxjpbtjkqwvoyejcjy.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// sign up function, i will test with making some accounts
// let { data, error } = await supabase.auth.signUp({
//   email: 'smiski@nyit.com',
//   password: 'nyit1234'
// });

// console.log(data, error)

// // sign in funciton
let signInObject = await supabase.auth.signInWithPassword( {
  email: "smiski@nyit.com",
  password: "nyit1234"
});
console.log(signInObject);

// // get user object
const userObject = await supabase.auth.getUser();
console.log(userObject);