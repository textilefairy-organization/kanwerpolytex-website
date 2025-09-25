// src/app/ThemeRegistry.tsx
'use client';

import React from 'react';
import createCache, {EmotionCache} from '@emotion/cache';
import {CacheProvider} from '@emotion/react';
import {useServerInsertedHTML} from 'next/navigation';

type ThemeRegistryProps = {
    children: React.ReactNode;
    options?: {
        key?: string;
        nonce?: string | undefined;
    };
};

/**
 * ThemeRegistry
 * - Collects Emotion inserted styles during SSR and injects them via useServerInsertedHTML.
 * - Uses a React ref for 'inserted' so it's clearly mutated and read.
 */
export default function ThemeRegistry({children, options = {}}: ThemeRegistryProps) {
    const key = options.key ?? 'mui';

    const insertedRef = React.useRef<string[]>([]);

    const {cache, flush} = React.useMemo(() => {
        const cache: EmotionCache = createCache({
            key,
            prepend: true,
            nonce: options.nonce,
        });

        type InsertFn = typeof cache.insert;
        const prevInsert: InsertFn = cache.insert;

        cache.insert = ((selector, serialized, sheet, shouldCache) => {
            const insertedMap = cache.inserted as Record<string, string | undefined>;
            if (insertedMap[serialized.name] === undefined) {
                insertedRef.current.push(serialized.name);
            }
            return prevInsert.call(cache, selector, serialized, sheet, shouldCache ?? false);
        }) as InsertFn;

        const flush = () => {
            // Only keep global or theme-level styles.
            // After (allow global + theme-level, skip component classes)
            const filtered = insertedRef.current.filter(
                name => name.startsWith('mui-global') || name.startsWith('mui-style')
            );
            insertedRef.current = [];
            return filtered;
        };

        return {cache, flush};
    }, [key, options.nonce]);

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }

        const insertedMap = cache.inserted as Record<string, string | undefined>;
        const styles = names
            .map(name => insertedMap[name])
            .filter((s): s is string => Boolean(s))
            .join('');

        return styles ? (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                nonce={options?.nonce}
                dangerouslySetInnerHTML={{__html: styles}}
            />
        ) : null;
    });

    return <CacheProvider value={cache}>{children}</CacheProvider>;
}