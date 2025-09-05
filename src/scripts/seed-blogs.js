/* eslint-disable no-console */
// Blog seeding script (CommonJS) compatible with `medusa exec`
// Usage examples:
//   BLOG_SEED_COUNT=100 npm run seed:blogs
//   BLOG_SEED_COUNT=2000 npm run seed:blogs

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

module.exports.default = async function seedBlogs({ container }) {
  const logger = container.resolve('logger')
  // Try multiple keys to locate the custom Blog module service
  let blogService
  const candidates = [
    'blogModuleService',
    'blogService',
    'blog',
    'BlogModuleService',
  ]
  for (const key of candidates) {
    try {
      const svc = container.resolve(key)
      if (svc) { blogService = svc; break }
    } catch {}
  }
  if (!blogService) {
    throw new Error("Could not resolve blog service from container (tried: " + candidates.join(', ') + ")")
  }

  const COUNT = Number(process.env.BLOG_SEED_COUNT || 100)
  const BATCH = Number(process.env.BLOG_SEED_BATCH || 100)

  logger.info(`Seeding ${COUNT} blogs...`)

  // Ensure categories exist
  const existingCats = await blogService.listBlogCategories({})
  const wantCategories = [
    'News',
    'Guides',
    'Releases',
    'Tips',
    'Stories',
    'Engineering',
  ]

  let categories = existingCats
  if (!existingCats || !existingCats.length) {
    const created = await blogService.createBlogCategories(
      wantCategories.map((name) => ({ name }))
    )
    categories = created
  }

  const tagPool = [
    'medusa',
    'ecommerce',
    'howto',
    'tutorial',
    'guide',
    'release',
    'tips',
    'best-practices',
    'performance',
    'security',
  ]

  const images = [
    'https://picsum.photos/seed/medusa1/1200/630',
    'https://picsum.photos/seed/medusa2/1200/630',
    'https://picsum.photos/seed/medusa3/1200/630',
    'https://picsum.photos/seed/medusa4/1200/630',
  ]

  function mkPost(i) {
    const title = `Demo Blog Post #${i} — ${pick([
      'Getting Started',
      'Deep Dive',
      'Best Practices',
      "What's New",
      'In Production',
      'Behind the Scenes',
    ])}`

    const category = pick(categories)
    const hashtags = Array.from(
      new Set(Array.from({ length: randomInt(2, 5) }, () => pick(tagPool)))
    )

    const paras = randomInt(3, 8)
    const content = Array.from({ length: paras }, (_, p) =>
      `# ${p === 0 ? title : `Section ${p}`}` +
      '\n\n' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Duis vehicula, augue sed tempus laoreet, massa purus luctus orci, ' +
      'a euismod velit justo id mauris. Vivamus in mattis mauris.\n\n'
    ).join('\n')

    return {
      category_id: category.id,
      title,
      image_url: pick(images),
      short_description: 'This is a demo blog post used for development and testing.',
      content,
      hashtags,
      read_time: randomInt(3, 12),
    }
  }

  let createdTotal = 0
  const toCreate = COUNT
  const batches = Math.ceil(toCreate / BATCH)

  for (let b = 0; b < batches; b++) {
    const size = Math.min(BATCH, toCreate - createdTotal)
    if (size <= 0) break

    const data = Array.from({ length: size }, (_, idx) => mkPost(createdTotal + idx + 1))
    // eslint-disable-next-line no-await-in-loop
    const created = await blogService.createBlogs(data)
    createdTotal += created.length
    logger.info(`Created batch ${b + 1}/${batches}: +${created.length} (total ${createdTotal})`)
  }

  logger.info(`Finished seeding blogs. Created ${createdTotal} blogs.`)
}
