
const postModules = import.meta.glob('./posts/*/*.svelte')
export async function load() {
    const summaries = [];

    const postPromises = Object.keys(postModules).map(async path => {
        const post = await postModules[path]();
        if(post.metadata){
            summaries.push({
                name: post.metadata.title,
                description: post.metadata.description,
                image: post.metadata.image,
                page: `/posts/${path.split('/')[2]}/`
            });
        }
        else{
            console.log("no meta data found")
        }
    })
    
    await Promise.all(postPromises);
    console.log(summaries)
    return {
            summaries
    }
}