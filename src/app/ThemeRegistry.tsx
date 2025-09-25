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

    const [{cache, flush}] = React.useState(() => {
        const cache: EmotionCache = createCache({
            key,
            prepend: true,
            nonce: options.nonce,
        });

        // Capture exact insert signature from a cache
        type InsertFn = typeof cache.insert;
        type InsertArgs = Parameters<InsertFn>;
        type InsertReturn = ReturnType<InsertFn>;

        const prevInsert: InsertFn = cache.insert;

        // Use a ref to hold inserted names so linter/TS sees both writes and reads.
        const insertedRef = {current: [] as string[]};

        const wrappedInsert = function (
            selector: InsertArgs[0],
            serialized: InsertArgs[1],
            sheet?: InsertArgs[2],
            shouldCache?: InsertArgs[3]
        ): InsertReturn {
            // cache.inserted maps name -> CSS string | undefined
            const insertedMap = cache.inserted as Record<string, string | undefined>;
            if (insertedMap[serialized.name] === undefined) {
                insertedRef.current.push(serialized.name);
            }

            const safeShouldCache: boolean = !!shouldCache;

            return prevInsert.call(
                cache,
                selector,
                serialized,
                sheet as Parameters<typeof cache.insert>[2],
                safeShouldCache
            );
        };

        cache.insert = wrappedInsert as InsertFn;

        const flush = () => {
            const prev = insertedRef.current;
            // Keep global styles like 'mui-global' so they aren’t re-inserted on a client
            const filtered = prev.filter(name => !name.startsWith('mui-global'));
            insertedRef.current = [];
            return filtered;
        };

        return {cache, flush};
    });

    useServerInsertedHTML(() => {
        const names = flush();
        if (names.length === 0) {
            return null;
        }

        const insertedMap = cache.inserted as Record<string, string | undefined>;
        let styles = '';
        for (const name of names) {
            const css = insertedMap[name];
            if (css) styles += css;
        }

        return (
            <style
                key={cache.key}
                data-emotion={`${cache.key} ${names.join(' ')}`}
                dangerouslySetInnerHTML={{__html: styles}}
            />
        );
    });

    return <CacheProvider value={cache}>{children}</CacheProvider>;
}