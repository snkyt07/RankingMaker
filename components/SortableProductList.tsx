'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ProductCard from './ProductCard'

interface Product {
  id: string
  name: string
  imageUrl: string
  link: string
  rank: number
}

interface SortableProductListProps {
  products: Product[]
  onReorder: (productIds: string[]) => void
  onDelete: (id: string) => void
}

function SortableItem({ product, onDelete }: { product: Product; onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProductCard product={product} onDelete={onDelete} isDragging={isDragging} />
    </div>
  )
}

export default function SortableProductList({ products, onReorder, onDelete }: SortableProductListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id)
      const newIndex = products.findIndex((p) => p.id === over.id)
      const newProducts = arrayMove(products, oldIndex, newIndex)
      onReorder(newProducts.map((p) => p.id))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {products.map((product) => (
            <SortableItem key={product.id} product={product} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

