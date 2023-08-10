import { posts } from './data.js'

export function load() {
    return {
        summaries: posts.map((post) => ({
            name: post.name,
            description: post.description,
            image: post.img,
            page: post.page
        }))
    }
}