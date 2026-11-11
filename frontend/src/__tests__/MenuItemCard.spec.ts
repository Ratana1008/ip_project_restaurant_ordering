import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import MenuItemCard from '@/components/MenuItemCard.vue'
import type { MenuItem } from '@/types'

const item: MenuItem = {
  id: 3,
  name: 'Fish amok',
  description: 'Steamed fish curry.',
  price: 7.5,
  categoryId: 2,
  isAvailable: true,
}

describe('MenuItemCard', () => {
  it('shows the item and emits add with the item', async () => {
    const wrapper = mount(MenuItemCard, {
      props: { item },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    expect(wrapper.text()).toContain('Fish amok')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('add')?.[0]).toEqual([item])
  })
})
