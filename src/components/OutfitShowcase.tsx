// components/OutfitShowcase.tsx (Client-side logic)
'use client';

import { useState } from 'react';
import type { Outfit } from '@/lib/outfits';
import { OutfitGrid } from './OutfitGrid';
import { OutfitViewDialog } from './OutfitViewDialog'; // 👈 Use the new component

// NOTE: Add mock data or use the actual data source for 'outfits' prop
const mockOutfits: Outfit[] = [
    // ... (Your mock data here)
];

interface OutfitShowcaseProps {
    outfits: Outfit[];
    onBack: () => void;
}

export function OutfitShowcase({ outfits, onBack }: OutfitShowcaseProps) {
    // This state controls the data passed to the dialog
    const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
    // This state controls the visual open/close state of the dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOutfitClick = (outfit: Outfit) => {
        // 1. Store the clicked outfit's data
        setSelectedOutfit(outfit);
        // 2. Set the flag to true to open the dialog
        setIsDialogOpen(true);
        console.log("Dialog state set to OPEN for outfit:", outfit.name);
    };

    const handleCloseDialog = () => {
        // Function passed to the Dialog component to close it
        setIsDialogOpen(false);
        // Optional: clear selected outfit data after closing
        // setSelectedOutfit(null);
    };

    return (
        <>
            <OutfitGrid 
                outfits={outfits} 
                onOutfitClick={handleOutfitClick} 
                onBack={onBack}
            />

            {/* Render the shared View Dialog */}
            <OutfitViewDialog
                outfit={selectedOutfit}
                isOpen={isDialogOpen} 
                onClose={handleCloseDialog}
            />
        </>
    );
}