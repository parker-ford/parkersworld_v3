
const postModules = import.meta.glob('./posts/*/*.svelte')
export async function load() {
    let summaries = [];

    const postPromises = Object.keys(postModules).map(async path => {
        const post = await postModules[path]();
        if(post.metadata){
            summaries.push({
                name: post.metadata.title,
                description: post.metadata.description,
                date: post.metadata.date,
                image: post.metadata.image,
                page: `/posts/${path.split('/')[2]}/`
            });
        }
        else{
            console.log("no meta data found")
        }
    })
    //summaries = summaries.reverse();
    await Promise.all(postPromises);
    
    return {
            summaries: summaries.reverse()
    }
}