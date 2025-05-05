import { createClient } from '@supabase/supabase-js';

// Substitua estas variáveis pelas suas credenciais do Supabase
const supabaseUrl = 'https://bsbymhpbueqeewypptjd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzYnltaHBidWVxZWV3eXBwdGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMTYzMTAsImV4cCI6MjA2MTc5MjMxMH0.3o_E5jYrzDr3XbWyUYKL2kbnR2C3o2l9aDTnHJLxsoc';

export const supabase = createClient(supabaseUrl, supabaseKey);