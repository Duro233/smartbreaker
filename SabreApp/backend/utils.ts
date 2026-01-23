export function buildPath(route:string) : string
{
    if(import.meta.env.MODE != 'development')
        return 'http://cuminmyshorts';
    
    return 'http://localhost:5000' + route
}