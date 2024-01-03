
const postModules = import.meta.glob('./posts/*/*.svelte')
export async function load() {
    let summaries = [];

    // const postPromises = Object.keys(postModules).map(async path => {
    //     const post = await postModules[path]();
    //     if(post.metadata){
    //         summaries.push({
    //             name: post.metadata.title,
    //             description: post.metadata.description,
    //             date: post.metadata.date,
    //             dateObj: new Date(post.metadata.date.split('/').reverse().join('-')),
    //             image_static: post.metadata.image_static,
    //             image: post.metadata.image,
    //             logo: post.metadata.logo,
    //             page: `/posts/${path.split('/')[2]}/`
    //         });
    //     }
    //     else{
    //         console.log("no meta data found")
    //     }
    // })
    // //summaries = summaries.reverse();
    // await Promise.all(postPromises);

    // summaries.sort((a, b) => b.dateObj - a.dateObj);

    await Promise.all(
        Object.keys(postModules).map(async path => {
            const post = await postModules[path]();
            if(post.metadata){
                summaries.push({
                    name: post.metadata.title,
                    description: post.metadata.description,
                    date: post.metadata.date,
                    dateObj: new Date(
                        (() => {
                            let dateParts = post.metadata.date.split('/');
                            let formattedDate = `${dateParts[2]}/${dateParts[0]}/${dateParts[1]}`;
                            return formattedDate;
                        })()
                    ),
                    image_static: post.metadata.image_static,
                    image: post.metadata.image,
                    logo: post.metadata.logo,
                    page: `/posts/${path.split('/')[2]}/`
                });
            }
            else{
                console.log("no meta data found")
            }
        })
    ).then(() => {
        summaries.sort((a, b) => b.dateObj - a.dateObj);
    });
    
    return {
            summaries
    }
}